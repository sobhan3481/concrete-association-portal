using ConcreteAssociation.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace ConcreteAssociation.Infrastructure.Persistence.Migrations;

[DbContext(typeof(ApplicationDbContext))]
partial class ApplicationDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasAnnotation("ProductVersion", "8.0.5");

        modelBuilder.Entity("ConcreteAssociation.Domain.Entities.Role", b =>
        {
            b.Property<Guid>("Id").ValueGeneratedOnAdd();
            b.Property<DateTime>("CreatedAtUtc");
            b.Property<string>("Name").HasMaxLength(64);
            b.Property<DateTime>("UpdatedAtUtc");
            b.HasKey("Id");
            b.HasIndex("Name").IsUnique();
            b.ToTable("Roles");
        });
    }
}
